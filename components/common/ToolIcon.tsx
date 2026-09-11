import React from 'react';
import {
  DollarSign,
  Search,
  Calculator,
  Image as ImageIcon,
  Download,
  Tag,
  ShieldAlert,
  BarChart2,
  UserCheck,
  Film,
  Video,
  TrendingUp,
  HelpCircle,
  Sparkles,
  Shield,
  Layers,
  MessageSquare,
  Trophy,
  ThumbsDown,
  FileText,
  EyeOff,
  FolderSearch,
  LucideProps,
} from 'lucide-react';

interface ToolIconProps extends LucideProps {
  name: string;
  className?: string;
}

export function ToolIcon({ name, className = 'w-5 h-5 text-[#7C3AED]', ...props }: ToolIconProps) {
  switch (name) {
    case 'video-downloader':
    case 'Video':
      return <Video className={className} {...props} />;
    case 'FolderSearch':
    case 'hidden-video-finder':
      return <FolderSearch className={className} {...props} />;
    case 'EyeOff':
    case 'private-viewer':
      return <EyeOff className={className} {...props} />;
    case 'FileText':
    case 'description-viewer':
      return <FileText className={className} {...props} />;
    case 'ThumbsDown':
    case 'dislike-checker':
      return <ThumbsDown className={className} {...props} />;
    case 'Trophy':
    case 'random-comment-picker':
      return <Trophy className={className} {...props} />;
    case 'MessageSquare':
    case 'comment-viewer':
      return <MessageSquare className={className} {...props} />;
    case 'DollarSign':
    case 'monetization-checker':
    case 'Monetization':
      return <DollarSign className={className} {...props} />;
    case 'Search':
    case 'channel-id-finder':
      return <Search className={className} {...props} />;
    case 'Calculator':
    case 'earnings-calculator':
      return <Calculator className={className} {...props} />;
    case 'Image':
    case 'thumbnail-downloader':
      return <ImageIcon className={className} {...props} />;
    case 'Download':
    case 'image-downloader':
      return <Download className={className} {...props} />;
    case 'Tag':
    case 'tag-extractor':
      return <Tag className={className} {...props} />;
    case 'ShieldAlert':
    case 'shadowban-detector':
      return <ShieldAlert className={className} {...props} />;
    case 'BarChart2':
    case 'data-viewer':
      return <BarChart2 className={className} {...props} />;
    case 'Channel':
      return <UserCheck className={className} {...props} />;
    case 'Video':
      return <Film className={className} {...props} />;
    case 'Analytics':
      return <TrendingUp className={className} {...props} />;
    case 'Help':
      return <HelpCircle className={className} {...props} />;
    case 'Sparkles':
      return <Sparkles className={className} {...props} />;
    default:
      return <Layers className={className} {...props} />;
  }
}

export function ToolIconBox({
  name,
  size = 'md',
  className = '',
}: {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-9 h-9 rounded-[13px]',
    md: 'w-11 h-11 rounded-[16px]',
    lg: 'w-12 h-12 rounded-[18px]',
  };
  const iconSizes = {
    sm: 'w-4.5 h-4.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div
      className={`bg-[#F2ECFE] border border-[#DDD0FA] text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs ${sizeClasses[size]} ${className}`}
    >
      <ToolIcon name={name} className={`${iconSizes[size]} text-[#7C3AED]`} />
    </div>
  );
}

export function CategoryIcon({ category, className = 'w-3.5 h-3.5' }: { category: string; className?: string }) {
  switch (category) {
    case 'Monetization':
      return <DollarSign className={className} />;
    case 'Channel':
      return <UserCheck className={className} />;
    case 'Video':
      return <Film className={className} />;
    case 'Analytics':
      return <TrendingUp className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}
