# Alumni Photos Directory

This directory contains headshot photos for alumni profiles.

## File Naming Convention

Photos should be named using the format: `{first-name}-{last-name}.jpg` (lowercase, hyphenated)

Example: `blaine-bryant.jpg`

## Image Requirements

- Format: JPG or PNG
- Recommended size: 400x400 pixels (square)
- File size: Under 500KB recommended
- Quality: High resolution, professional headshot

## Adding a New Photo

1. Save the photo file in this directory with the correct naming convention
2. Update the `headshot` field in `public/alumni.json` to match the filename
3. The path should be: `/alumni-photos/{filename}.jpg`

