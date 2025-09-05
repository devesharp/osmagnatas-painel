import { ThreeDots } from "react-loader-spinner";

interface LoadingForegroundProps {
  visible?: boolean;
}

export function LoadingForeground({ visible = true }: LoadingForegroundProps) {
  if (!visible) return null;

  return (
    <div className="absolute w-full h-full bg-background/80 top-0 left-0 z-15 flex items-center justify-center">
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="var(--color-primary)"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}