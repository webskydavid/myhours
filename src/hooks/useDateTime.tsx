const useDateTime = () => {
  const dateFormat = (date: string) => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const days = newDate.getDate();

    return '';
  };
  return { dateFormat };
};

export default useDateTime;
