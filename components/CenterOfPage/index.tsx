const CenterOfPage: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div style={{ maxWidth: 1000, width: "100%" }}>{children}</div>;
};

export default CenterOfPage;
