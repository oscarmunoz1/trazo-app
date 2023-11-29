function HTMLRenderer({ htmlString }: { htmlString: string }) {
  const createMarkup = () => {
    return { __html: htmlString };
  };

  return <div dangerouslySetInnerHTML={createMarkup()} />;
}

export default HTMLRenderer;
