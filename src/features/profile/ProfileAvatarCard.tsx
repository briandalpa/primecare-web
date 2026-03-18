import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import type { ProfileData } from '@/types/profile';

interface Props {
  profile: ProfileData;
  initials: string;
  roleBadge: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileAvatarCard({
  profile,
  initials,
  roleBadge,
  fileInputRef,
  onAvatarChange,
}: Props) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatarUrl || undefined} alt={profile.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/0 group-hover:bg-foreground/40 transition-colors cursor-pointer"
            >
              <Camera className="h-5 w-5 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold text-foreground font-heading">
                {profile.name}
              </h2>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {roleBadge}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{profile.email}</p>
            <p className="text-xs text-muted-foreground mt-1">Click photo to update</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
