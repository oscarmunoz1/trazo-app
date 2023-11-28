import { Box, useStyleConfig } from '@chakra-ui/react';

type MainPanelProps = {
  variant?: string;
  children: React.ReactNode;
};

function MainPanel(props: MainPanelProps) {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig('MainPanel', { variant });
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
}

export default MainPanel;
