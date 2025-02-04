import { Box, keyframes } from '@chakra-ui/react';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

interface ShimmerProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

const Shimmer = ({ width = '100%', height = '100%', borderRadius = '15px' }: ShimmerProps) => {
  return (
    <Box
      width={width}
      height={height}
      borderRadius={borderRadius}
      background="linear-gradient(to right, #e0e0e0 0%, #f5f5f5 20%, #e0e0e0 40%, #e0e0e0 100%)"
      backgroundSize="1000px 100%"
      animation={`${shimmer} 1.5s ease-in-out infinite`}
    />
  );
};

export default Shimmer;
