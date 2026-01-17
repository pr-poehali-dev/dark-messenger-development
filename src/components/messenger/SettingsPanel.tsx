import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const SettingsPanel = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold">Настройки</h2>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Shield" size={20} />
            Конфиденциальность
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Показывать статус онлайн</p>
                <p className="text-sm text-muted-foreground">Друзья видят когда вы в сети</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Публичный плейлист</p>
                <p className="text-sm text-muted-foreground">Другие могут видеть вашу музыку</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Показывать номер телефона</p>
                <p className="text-sm text-muted-foreground">Только для друзей</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Globe" size={20} />
            Язык и регион
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Язык интерфейса</label>
              <Select defaultValue="ru">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="uk">Українська</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Palette" size={20} />
            Тема
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Icon name="Moon" size={24} />
              Темная
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" disabled>
              <Icon name="Sun" size={24} />
              Светлая
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="Volume2" size={20} />
            Звуки и уведомления
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Звук уведомлений</p>
                <p className="text-sm text-muted-foreground">Воспроизводить при новых сообщениях</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Вибрация</p>
                <p className="text-sm text-muted-foreground">При входящих звонках</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-destructive">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-destructive">
            <Icon name="Ban" size={20} />
            Черный список
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Пользователи из черного списка не смогут писать вам сообщения
          </p>
          <Button variant="outline" onClick={() => toast.success('Черный список пуст')}>
            Посмотреть заблокированных (0)
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Icon name="HelpCircle" size={20} />
            Служба поддержки
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Возникли вопросы? Напишите нам в службу поддержки
          </p>
          <Button onClick={() => toast.success('Переход в поддержку...')}>
            <Icon name="MessageCircle" size={18} className="mr-2" />
            Написать в поддержку
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPanel;
