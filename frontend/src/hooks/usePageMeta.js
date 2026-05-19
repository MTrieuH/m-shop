import { useEffect } from 'react';

export default function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    const prevDescription = metaDescriptionTag ? metaDescriptionTag.getAttribute('content') : '';

    document.title = `${title} | M-Shop - Mô Hình Lắp Ráp`;
    
    if (description) {
      if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute('content', description);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = description;
        document.head.appendChild(newMeta);
      }
    }

    return () => {
      document.title = prevTitle;
      if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute('content', prevDescription);
      } else {
        const addedMeta = document.querySelector('meta[name="description"]');
        if (addedMeta) {
          document.head.removeChild(addedMeta);
        }
      }
    };
  }, [title, description]);
}
