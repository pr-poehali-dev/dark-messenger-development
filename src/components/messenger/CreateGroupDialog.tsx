import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (group: any) => void;
}

const CreateGroupDialog = ({ open, onOpenChange, onCreate }: CreateGroupDialogProps) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'group' | 'channel'>('group');

  const handleCreate = () => {
    if (name.trim()) {
      onCreate({
        id: Date.now(),
        name,
        type,
        avatar: null,
        lastMessage: '',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        unread: 0,
        members: type === 'group' ? 1 : undefined,
        subscribers: type === 'channel' ? 0 : undefined
      });
      
      toast.success(`${type === 'group' ? 'Группа' : 'Канал'} создан`);
      setName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Создать {type === 'group' ? 'группу' : 'канал'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <RadioGroup value={type} onValueChange={(v) => setType(v as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="group" id="group" />
              <Label htmlFor="group" className="flex items-center gap-2 cursor-pointer">
                <Icon name="Users" size={18} />
                Группа
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="channel" id="channel" />
              <Label htmlFor="channel" className="flex items-center gap-2 cursor-pointer">
                <Icon name="Radio" size={18} />
                Канал
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label>Название</Label>
            <Input
              placeholder={`Название ${type === 'group' ? 'группы' : 'канала'}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Button onClick={handleCreate} className="w-full" disabled={!name.trim()}>
            <Icon name="Plus" size={18} className="mr-2" />
            Создать
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
