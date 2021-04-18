export const logger = (
  title: string,
  state: any,
  type: string,
  action: any
) => {
  console.groupCollapsed(title, type);
  console.log('STATE', state);
  console.table('ACTION', action);
  console.groupEnd();
};
