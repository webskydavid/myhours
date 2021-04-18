export interface IEvent {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  creator: ICreator;
  organizer: IOrganizer;
  start: IStartOrEnd;
  end: IStartOrEnd;
  iCalUID: string;
  sequence: number;
  reminders: IReminders;
  eventType: string;
}
export interface ICreator {
  email: string;
}
export interface IOrganizer {
  email: string;
  displayName: string;
  self: boolean;
}
export interface IStartOrEnd {
  dateTime: string;
  timeZone: string;
}
export interface IReminders {
  useDefault: boolean;
}
