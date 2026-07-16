import { NotificationSettings } from "@/components/settings/notification-settings";
import { ThemeSettingsPanel } from "@/components/settings/theme-settings-panel";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <p className="eyebrow">Settings</p>
        <div>
          <h1>Preferences</h1>
          <p>Manage appearance, install behavior, and reminder permissions.</p>
        </div>
      </div>
      <ThemeSettingsPanel />
      <NotificationSettings />
    </div>
  );
}
