import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { FiFileText, FiLogOut } from 'react-icons/fi'
import { logout } from '../features/auth/authSlice'

function MainLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login')
  }

  return (
    <Box minH="100vh" position="relative">
      <Box className="gd-orb gd-orb-left" />
      <Box className="gd-orb gd-orb-right" />

      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex="10"
        borderBottom="1px solid rgba(226, 232, 240, 0.8)"
        bg="rgba(248, 250, 252, 0.82)"
        backdropFilter="blur(18px)"
      >
        <Container maxW="7xl" py="4">
          <Flex align="center" justify="space-between" gap="4">
            <HStack gap="4">
              <Box
                rounded="2xl"
                bg="linear-gradient(135deg, #2563eb, #38bdf8)"
                color="white"
                p="3"
                boxShadow="0 14px 28px rgba(37, 99, 235, 0.24)"
              >
                <FiFileText size={18} />
              </Box>
              <Stack gap="0">
                <Text fontSize="xl" fontWeight="800" color="var(--gd-text)">
                  GoodDocs
                </Text>
                <Text fontSize="sm" color="var(--gd-muted)">
                  Lightweight collaborative writing
                </Text>
              </Stack>
            </HStack>

            <HStack gap="3">
              <Badge
                rounded="full"
                bg="rgba(37, 99, 235, 0.10)"
                color="#1d4ed8"
                px="3"
                py="1.5"
                textTransform="none"
                fontWeight="700"
              >
                {user?.name}
              </Badge>
              <Button variant="ghost" onClick={handleLogout}>
                <HStack gap="2">
                  <FiLogOut />
                  <Text>Logout</Text>
                </HStack>
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={{ base: '6', md: '8' }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default MainLayout
