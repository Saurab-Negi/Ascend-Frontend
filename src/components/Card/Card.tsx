


export const Card = ({ children, className, style, onClick }:{children: React.ReactNode, className?: string,  style?: React.CSSProperties, onClick?: () => void}) => {
  return (
    <div className={`rounded-lg shadow-sm border  ${className}`}  style={style} onClick={onClick}>
      {children}
    </div>
  );
};

export const CardContent = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return <div className={`p-4 ${className || ""}`} style={style}>{children}</div>;
};
