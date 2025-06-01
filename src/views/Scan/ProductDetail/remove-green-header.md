# Quick Fix: Remove Green Header Background

## Problem

The ProductDetail page has a heavy green gradient background that doesn't follow app standards.

## Solution

Replace the background Box component in `ProductDetail.tsx` around line 398:

### Current Code (REMOVE):

```tsx
<Box
  position="absolute"
  minH={{ base: '70vh', md: '50vh' }}
  w={{ md: 'calc(100vw - 50px)' }}
  borderRadius={{ md: '15px' }}
  left="0"
  right="0"
  bgRepeat="no-repeat"
  overflow="hidden"
  zIndex="-1"
  top="0"
  bgImage={BgSignUp}
  marginInlineEnd={'25px'}
  _before={{
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'linear-gradient(180deg, rgba(0,128,0,0.85) 0%, rgba(0,128,0,0.6) 100%)',
    borderRadius: '15px',
    zIndex: 0
  }}
  bgSize="cover"
  mx={{ md: 'auto' }}
  mt={{ md: '14px' }}></Box>
```

### New Code (REPLACE WITH):

```tsx
{
  /* Clean Header Section */
}
<Box pt="40px" pb="20px" px={4} bg={bgColor}>
  <Flex
    direction="column"
    textAlign="center"
    justifyContent="center"
    align="center"
    maxW="6xl"
    mx="auto">
    <Heading as="h1" size="2xl" color={titleColor} fontWeight="bold" mb={3}>
      {intl.formatMessage({ id: 'app.welcome' })}
    </Heading>
    <Text
      fontSize="lg"
      color={textColor}
      fontWeight="normal"
      maxW={{ base: '90%', sm: '60%', lg: '50%' }}
      lineHeight="1.6">
      {intl.formatMessage({ id: 'app.welcomeMessage' })}
    </Text>
  </Flex>
</Box>;
```

## Also Update:

Change the Flex section that comes after to remove the green-dependent styling:

- Remove `mt="6.5rem"` and `pt={'55px'}`
- Remove `color="white"` from Text elements
- Update the Card margin from `mt={{ md: '75px' }}` to `mt="20px"`

This will give you a clean, modern header that follows app design standards!
