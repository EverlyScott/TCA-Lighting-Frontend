const useCurrentHostname = () => {
  if (typeof window === "object") {
    return location.hostname;
  } else {
    return "127.0.0.1";
  }
};

export default useCurrentHostname;
