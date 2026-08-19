import { useEffect } from 'react';

const SITE_NAME = 'Biswash Ghimire';
export const SITE_TITLE = `${SITE_NAME} | Software Engineer`;

export const useDocumentTitle = (label) => {
  useEffect(() => {
    document.title = label ? `${label} | ${SITE_NAME}` : SITE_TITLE;
  }, [label]);
};

export default useDocumentTitle;
