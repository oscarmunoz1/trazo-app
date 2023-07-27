import React from "react";

function HTMLRenderer({ htmlString }) {
  const createMarkup = () => {
    return { __html: htmlString };
  };

  return <div dangerouslySetInnerHTML={createMarkup()} />;
}

export default HTMLRenderer;
