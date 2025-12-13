import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Settings() {
  return (
    <div className="flex-1 p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <div className="p-4 rounded-xl border border-border bg-card">
          <h2 className="font-medium mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email notifications</Label>
              <Switch id="email-notifications" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push notifications</Label>
              <Switch id="push-notifications" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card">
          <h2 className="font-medium mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save">Auto-save drafts</Label>
              <Switch id="auto-save" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark mode</Label>
              <Switch id="dark-mode" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card">
          <h2 className="font-medium mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics">Share usage analytics</Label>
              <Switch id="analytics" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
