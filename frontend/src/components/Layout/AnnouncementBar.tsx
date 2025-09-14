import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { announcementApi, Announcement } from '../../services/api';

const AnnouncementBar: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await announcementApi.getActiveAnnouncements();
        
        if (response.success && response.data && response.data.length > 0) {
          setAnnouncement(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch announcement:', error);
        // Fallback to static announcement
        setAnnouncement({
          id: 'fallback',
          title: 'Welcome Offer',
          text: '🎉 Use WELCOME10!',
          backgroundColor: 'orange',
          textColor: 'white',
          link: '/offers',
          isActive: true,
          priority: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  const getBackgroundColor = (color: string, customColor?: string) => {
    if (color === 'custom' && customColor) {
      return '';
    }
    const colors: { [key: string]: string } = {
      orange: 'bg-[#F9A246]',
      blue: 'bg-blue-600',
      green: 'bg-green-600',
      red: 'bg-red-600',
      purple: 'bg-purple-600',
      black: 'bg-black',
    };
    return colors[color] || 'bg-[#F9A246]';
  };

  const getTextColor = (color: string, customColor?: string) => {
    if (color === 'custom' && customColor) {
      return '';
    }
    const colors: { [key: string]: string } = {
      white: 'text-white',
      black: 'text-black',
      gray: 'text-gray-600',
    };
    return colors[color] || 'text-white';
  };

  const getCustomStyles = () => {
    const styles: React.CSSProperties = {};
    if (announcement?.backgroundColor === 'custom' && announcement?.customBackgroundColor) {
      styles.backgroundColor = announcement.customBackgroundColor;
    }
    if (announcement?.textColor === 'custom' && announcement?.customTextColor) {
      styles.color = announcement.customTextColor;
    }
    return styles;
  };

  if (isLoading || !announcement || !isVisible) {
    return null;
  }

  const handleClick = () => {
    if (announcement.link) {
      window.open(announcement.link, '_blank');
    }
  };

  return (
    <div 
      className={`${getBackgroundColor(announcement.backgroundColor, announcement.customBackgroundColor)} ${getTextColor(announcement.textColor, announcement.customTextColor)} py-2 px-4 text-center text-sm font-medium relative z-[9999]`}
      style={getCustomStyles()}
    >
      <div className="max-w-7xl mx-auto">
        <div 
          className={`text-center whitespace-nowrap ${announcement.link ? 'cursor-pointer hover:underline' : ''}`}
          onClick={handleClick}
        >
          {announcement.text}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;