const CenterOfPage: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div style={{ maxWidth: 1000, flexGrow: 1 }}>{children}</div>;
};

export default CenterOfPage;
