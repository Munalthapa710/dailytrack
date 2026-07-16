import { NotificationSettings } from "@/components/settings/notification-settings";
import { ThemeSettingsPanel } from "@/components/settings/theme-settings-panel";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="panel p-6">
        <p className="eyebrow">Settings</p>
        <h1 className="title-display mt-3 text-3xl">Preferences</h1>
      </div>
      <ThemeSettingsPanel />
      <NotificationSettings />
    </div>
  );
}
