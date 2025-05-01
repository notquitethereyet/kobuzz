import os
import json
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class Config:
    """Configuration management for the application"""

    def __init__(self, config_file=None):
        """Initialize configuration

        Args:
            config_file (str, optional): Path to config file. Defaults to None.
        """
        # Get config file path from environment or use default
        self.config_file = config_file or os.getenv('CONFIG_FILE', os.path.expanduser('~/.ko-buzz/config.json'))
        self.config_dir = os.path.dirname(self.config_file)

        # Get default settings from environment variables or use defaults
        default_download_dir = os.getenv('DEFAULT_DOWNLOAD_DIR', '~/Music/Qobuz Downloads')
        default_quality = int(os.getenv('DEFAULT_QUALITY', 6))

        self.default_settings = {
            'download_dir': os.path.expanduser(default_download_dir),
            'quality': default_quality,  # Default to FLAC 16-bit
            'embed_art': os.getenv('DEFAULT_EMBED_ART', 'True').lower() in ('true', '1', 't'),
            'folder_format': os.getenv('DEFAULT_FOLDER_FORMAT', '{artist} - {album} ({year}) [{bit_depth}B-{sampling_rate}kHz]'),
            'track_format': os.getenv('DEFAULT_TRACK_FORMAT', '{tracknumber}. {tracktitle}'),
            'quality_fallback': os.getenv('DEFAULT_QUALITY_FALLBACK', 'True').lower() in ('true', '1', 't'),
            'cover_og_quality': os.getenv('DEFAULT_COVER_OG_QUALITY', 'False').lower() in ('true', '1', 't'),
            'no_cover': os.getenv('DEFAULT_NO_COVER', 'False').lower() in ('true', '1', 't'),
        }
        self.settings = self._load_settings()

    def _load_settings(self):
        """Load settings from config file"""
        if not os.path.exists(self.config_dir):
            os.makedirs(self.config_dir, exist_ok=True)

        if not os.path.exists(self.config_file):
            logger.info(f"Config file not found. Creating default at {self.config_file}")
            self._save_settings(self.default_settings)
            return self.default_settings

        try:
            with open(self.config_file, 'r') as f:
                settings = json.load(f)
                # Merge with defaults to ensure all keys exist
                for key, value in self.default_settings.items():
                    if key not in settings:
                        settings[key] = value
                return settings
        except Exception as e:
            logger.error(f"Error loading config: {str(e)}")
            return self.default_settings

    def _save_settings(self, settings):
        """Save settings to config file"""
        try:
            with open(self.config_file, 'w') as f:
                json.dump(settings, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving config: {str(e)}")

    def get_settings(self):
        """Get current settings"""
        return self.settings

    def update_settings(self, new_settings):
        """Update settings

        Args:
            new_settings (dict): New settings to update
        """
        self.settings.update(new_settings)
        self._save_settings(self.settings)
        return self.settings

    def get_setting(self, key, default=None):
        """Get a specific setting

        Args:
            key (str): Setting key
            default: Default value if key not found

        Returns:
            Setting value
        """
        return self.settings.get(key, default)
