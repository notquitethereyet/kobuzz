import os
import sys
import logging
import threading
import zipfile
import shutil
import uuid
import time
from pathlib import Path

# Import qobuz-dl directly (installed via pip)
try:
    from qobuz_dl.core import QobuzDL
    from qobuz_dl.exceptions import NonStreamable
except ImportError:
    # Fallback to local path if installed package not found
    try:
        # Add qobuz-dl to path
        sys.path.append(str(Path(__file__).parent.parent.parent / 'qobuz-dl'))
        from qobuz_dl.core import QobuzDL
        from qobuz_dl.exceptions import NonStreamable
    except ImportError:
        raise ImportError("qobuz-dl not found. Please install it with 'pip install qobuz-dl' or clone the repository.")

logger = logging.getLogger(__name__)

class QobuzService:
    """Service to interface with qobuz-dl"""

    def __init__(self, config):
        """Initialize QobuzService

        Args:
            config (Config): Configuration object
        """
        self.config = config
        self.qobuz = None
        self.download_status = {
            'active': False,
            'total': 0,
            'completed': 0,
            'current_item': None,
            'errors': [],
            'zip_file': None,
            'download_complete': False,
            'last_download_time': None
        }
        self.download_thread = None
        self.zip_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'downloads')

        # Create zip directory if it doesn't exist
        os.makedirs(self.zip_dir, exist_ok=True)

    def authenticate(self, email, password):
        """Authenticate with Qobuz

        Args:
            email (str): Qobuz email
            password (str): Qobuz password

        Returns:
            dict: Authentication result
        """
        try:
            settings = self.config.get_settings()
            self.qobuz = QobuzDL(
                directory=settings['download_dir'],
                quality=settings['quality'],
                embed_art=settings['embed_art'],
                folder_format=settings['folder_format'],
                track_format=settings['track_format'],
                quality_fallback=settings['quality_fallback'],
                cover_og_quality=settings['cover_og_quality'],
                no_cover=settings['no_cover']
            )

            # Get tokens (app_id and secrets)
            self.qobuz.get_tokens()

            # Initialize client
            self.qobuz.initialize_client(email, password, self.qobuz.app_id, self.qobuz.secrets)

            # Get membership info from client
            membership = "Premium"
            try:
                if hasattr(self.qobuz.client, 'user_auth_status'):
                    membership = self.qobuz.client.user_auth_status.get('user', {}).get('credential', {}).get('description', 'Premium')
                elif hasattr(self.qobuz.client, 'user'):
                    membership = self.qobuz.client.user.get('credential', {}).get('description', 'Premium')
            except Exception as e:
                logger.warning(f"Could not get membership info: {str(e)}")

            return {
                'success': True,
                'message': 'Authentication successful',
                'membership': membership
            }
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise Exception(f"Authentication failed: {str(e)}")

    def search(self, query, item_type='album', limit=10):
        """Search for music on Qobuz

        Args:
            query (str): Search query
            item_type (str, optional): Type of item to search for. Defaults to 'album'.
            limit (int, optional): Maximum number of results. Defaults to 10.

        Returns:
            list: Search results
        """
        if not self.qobuz:
            raise Exception("Not authenticated. Please authenticate first.")

        try:
            results = self.qobuz.search_by_type(query, item_type, limit)
            return results
        except Exception as e:
            logger.error(f"Search error: {str(e)}")
            raise Exception(f"Search failed: {str(e)}")

    def download(self, urls, quality=None, directory=None, embed_art=None):
        """Download music from Qobuz

        Args:
            urls (list): List of URLs to download
            quality (int, optional): Quality to download. Defaults to None.
            directory (str, optional): Download directory. Defaults to None.
            embed_art (bool, optional): Whether to embed artwork. Defaults to None.

        Returns:
            dict: Download status
        """
        if not self.qobuz:
            raise Exception("Not authenticated. Please authenticate first.")

        if self.download_status['active']:
            return {
                'success': False,
                'message': 'Download already in progress',
                'status': self.download_status
            }

        # Update settings if provided
        settings = self.config.get_settings()
        if quality is not None:
            self.qobuz.quality = quality
        if directory is not None:
            self.qobuz.directory = directory
        if embed_art is not None:
            self.qobuz.embed_art = embed_art

        # Reset download status
        self.download_status = {
            'active': True,
            'total': len(urls),
            'completed': 0,
            'current_item': None,
            'errors': [],
            'zip_file': None,
            'download_complete': False,
            'last_download_time': None
        }

        # Start download in a separate thread
        self.download_thread = threading.Thread(
            target=self._download_thread,
            args=(urls,)
        )
        self.download_thread.daemon = True
        self.download_thread.start()

        return {
            'success': True,
            'message': f'Download started for {len(urls)} items',
            'status': self.download_status
        }

    def _download_thread(self, urls):
        """Download thread

        Args:
            urls (list): List of URLs to download
        """
        try:
            for i, url in enumerate(urls):
                try:
                    self.download_status['current_item'] = url
                    self.qobuz.handle_url(url)
                    self.download_status['completed'] += 1
                except Exception as e:
                    error_msg = f"Error downloading {url}: {str(e)}"
                    logger.error(error_msg)
                    self.download_status['errors'].append(error_msg)

            # Create zip file after all downloads are complete
            if self.download_status['completed'] > 0:
                zip_path = self.create_zip_file()
                if zip_path:
                    self.download_status['download_complete'] = True
                    self.download_status['zip_file'] = zip_path
                    self.download_status['last_download_time'] = time.time()
                    logger.info(f"Download complete. Zip file created at: {zip_path}")
                else:
                    logger.error("Failed to create zip file")

        except Exception as e:
            logger.error(f"Download thread error: {str(e)}")
            self.download_status['errors'].append(f"Download thread error: {str(e)}")
        finally:
            self.download_status['active'] = False
            self.download_status['current_item'] = None
            logger.info(f"Final download status: {self.download_status}")

    def create_zip_file(self):
        """Create a zip file of the downloaded content"""
        try:
            settings = self.config.get_settings()
            download_dir = settings['download_dir']

            # Generate a unique filename for the zip
            zip_filename = f"qobuz_download_{uuid.uuid4().hex[:8]}_{int(time.time())}.zip"
            zip_path = os.path.join(self.zip_dir, zip_filename)

            # Create the zip file
            logger.info(f"Creating zip file: {zip_path}")

            with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                # Walk through the download directory
                for root, dirs, files in os.walk(download_dir):
                    # Skip hidden files and directories
                    files = [f for f in files if not f.startswith('.')]
                    dirs[:] = [d for d in dirs if not d.startswith('.')]

                    for file in files:
                        file_path = os.path.join(root, file)
                        # Calculate the relative path for the zip file
                        rel_path = os.path.relpath(file_path, download_dir)
                        zipf.write(file_path, rel_path)

            # Log success
            logger.info(f"Zip file created successfully: {zip_path}")

            return zip_path
        except Exception as e:
            error_msg = f"Error creating zip file: {str(e)}"
            logger.error(error_msg)
            self.download_status['errors'].append(error_msg)
            return None

    def get_download_status(self):
        """Get download status

        Returns:
            dict: Download status
        """
        return self.download_status

    def get_zip_file(self):
        """Get the path to the zip file

        Returns:
            str: Path to the zip file or None if not available
        """
        return self.download_status.get('zip_file')

    def clear_downloads(self):
        """Clear downloaded files and reset download status

        Returns:
            dict: Result of the operation
        """
        try:
            # Get the download directory from settings
            settings = self.config.get_settings()
            download_dir = settings['download_dir']

            # Get the zip file path
            zip_file = self.download_status.get('zip_file')

            # Delete the zip file if it exists
            if zip_file and os.path.exists(zip_file):
                os.remove(zip_file)
                logger.info(f"Deleted zip file: {zip_file}")

            # Reset download status
            self.download_status = {
                'active': False,
                'total': 0,
                'completed': 0,
                'current_item': None,
                'errors': [],
                'zip_file': None,
                'download_complete': False,
                'last_download_time': None
            }

            return {
                'success': True,
                'message': 'Downloads cleared successfully'
            }
        except Exception as e:
            error_msg = f"Error clearing downloads: {str(e)}"
            logger.error(error_msg)
            return {
                'success': False,
                'message': error_msg
            }
