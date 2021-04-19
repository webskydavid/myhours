export interface ICalendar {
  kind: string;
  etag: string;
  id: string;
  summary: string;
  timeZone: string;
  colorId: string;
  backgroundColor: string;
  foregroundColor: string;
  selected: boolean;
  accessRole: string;
  defaultReminders?: IDefaultRemindersEntity[] | null;
  notificationSettings: INotificationSettings;
  primary: boolean;
  conferenceProperties: IConferenceProperties;
}
export interface IDefaultRemindersEntity {
  method: string;
  minutes: number;
}
export interface INotificationSettings {
  notifications?: INotificationsEntity[] | null;
}
export interface INotificationsEntity {
  type: string;
  method: string;
}
export interface IConferenceProperties {
  allowedConferenceSolutionTypes?: string[] | null;
}
