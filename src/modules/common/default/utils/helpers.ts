export const sleep = (time: number) =>
  new Promise((res) => setTimeout(res, time));

export const calculateWindowSize = (windowWidth: number) => {
  if (windowWidth >= 1200) {
    return 'lg';
  }
  if (windowWidth >= 992) {
    return 'md';
  }
  if (windowWidth >= 768) {
    return 'sm';
  }
  return 'xs';
};

export const setWindowClass = (classList: string) => {
  if (document && document.body) {
    // @ts-ignore
    document.body.className = classList;
  }
};

export const addWindowClass = (classList: string) => {
  if (document && document.body) {
    document.body.classList.add(classList);
  }
};

export const removeWindowClass = (classList: string) => {
  if (document && document.body) {
    document.body.classList.remove(classList);
  }
};


