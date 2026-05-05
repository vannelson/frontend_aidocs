import {
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Grid,
  Heading,
  HStack,
  Input,
  NativeSelect,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiCheckCircle, FiEdit3, FiShield } from 'react-icons/fi'
import { login, register } from '../features/auth/authSlice'
import { toaster } from '../utils/toaster'

const demoAccounts = [
  { name: 'Ava Owner', email: 'ava@gooddocs.test', role: 'Owner' },
  { name: 'Ben Editor', email: 'ben@gooddocs.test', role: 'Editor' },
  { name: 'Cara Viewer', email: 'cara@gooddocs.test', role: 'Viewer' },
]

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token, user, status } = useSelector((state) => state.auth)
  const [mode, setMode] = useState('login')
  const [selectedDemo, setSelectedDemo] = useState(demoAccounts[0].email)
  const [loginForm, setLoginForm] = useState({
    email: demoAccounts[0].email,
    password: 'password123',
  })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const selectedDemoAccount = useMemo(
    () => demoAccounts.find((account) => account.email === selectedDemo),
    [selectedDemo]
  )

  if (token && user) {
    return <Navigate to="/documents" replace />
  }

  const handleDemoChange = (event) => {
    const email = event.target.value
    setSelectedDemo(email)
    setLoginForm({
      email,
      password: 'password123',
    })
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()

    const resultAction = await dispatch(login(loginForm))

    if (login.fulfilled.match(resultAction)) {
      toaster.create({
        title: `Welcome ${resultAction.payload.user.name}`,
        description: 'You are now signed in to GoodDocs.',
        type: 'success',
      })
      navigate('/documents')
      return
    }

    toaster.create({
      title: 'Invalid Credential',
      description: 'Please check your email and password and try again.',
      type: 'error',
    })
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()

    const resultAction = await dispatch(register(registerForm))

    if (register.fulfilled.match(resultAction)) {
      toaster.create({
        title: `Welcome ${resultAction.payload.user.name}`,
        description: 'Your account has been created successfully.',
        type: 'success',
      })
      navigate('/documents')
      return
    }

    toaster.create({
      title: 'Registration failed',
      description:
        resultAction.payload || 'Please review your details and try again.',
      type: 'error',
    })
  }

  return (
    <Box minH="100vh" position="relative" overflow="hidden">
      <Box className="gd-orb gd-orb-left" />
      <Box className="gd-orb gd-orb-right" />

      <Grid templateColumns={{ base: '1fr', xl: '1.08fr 0.92fr' }} minH="100vh">
        <Flex
          direction="column"
          justify="space-between"
          px={{ base: '6', md: '10', xl: '16' }}
          py={{ base: '10', md: '14' }}
          gap="10"
        >
          <Stack gap="6" maxW="3xl">
            <Badge
              alignSelf="flex-start"
              rounded="full"
              px="3"
              py="1.5"
              bg="rgba(37, 99, 235, 0.10)"
              color="#1d4ed8"
              textTransform="none"
              fontWeight="700"
            >
              GoodDocs workspace
            </Badge>

            <Stack gap="4">
              <Heading
                fontSize={{ base: '4xl', md: '6xl' }}
                lineHeight="0.95"
                letterSpacing="-0.05em"
                color="var(--gd-text)"
                maxW="900px"
              >
                Write faster, share clearly, and keep every draft within reach.
              </Heading>
              <Text fontSize={{ base: 'md', md: 'xl' }} color="var(--gd-muted)" maxW="2xl">
                A focused collaborative editor with clean document management, practical sharing,
                and a login flow built for quick evaluation.
              </Text>
            </Stack>

            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4" maxW="2xl">
              <FeatureCard
                icon={<FiEdit3 />}
                title="Document-first workflow"
                description="Create, edit, rename, import, and reopen polished drafts in a lightweight interface."
              />
              <FeatureCard
                icon={<FiShield />}
                title="Simple access control"
                description="Show clear owner, editor, and viewer behavior without enterprise complexity."
              />
            </Grid>
          </Stack>

          <Box
            rounded="32px"
            border="1px solid rgba(148, 163, 184, 0.18)"
            bg="rgba(255, 255, 255, 0.72)"
            boxShadow="0 24px 48px rgba(15, 23, 42, 0.08)"
            p={{ base: '5', md: '6' }}
            maxW="2xl"
          >
            <Stack gap="4">
              <HStack justify="space-between" align="start">
                <Stack gap="1">
                  <Text fontWeight="800" color="var(--gd-text)">
                    Demo account suggestion
                  </Text>
                  <Text fontSize="sm" color="var(--gd-muted)">
                    Pick a seeded user to instantly fill the sign-in form.
                  </Text>
                </Stack>
                {selectedDemoAccount ? (
                  <Badge rounded="full" bg="rgba(14, 165, 233, 0.10)" color="#0369a1">
                    {selectedDemoAccount.role}
                  </Badge>
                ) : null}
              </HStack>

              <Field.Root>
                <Field.Label fontWeight="600">Seeded users</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={selectedDemo}
                    onChange={handleDemoChange}
                    borderRadius="18px"
                    borderColor="rgba(148, 163, 184, 0.24)"
                    bg="rgba(248, 250, 252, 0.92)"
                  >
                    {demoAccounts.map((account) => (
                      <option key={account.email} value={account.email}>
                        {account.name} ({account.role})
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              <HStack justify="space-between" wrap="wrap" gap="3">
                <Text fontSize="sm" color="var(--gd-muted)">
                  Suggested login: {selectedDemoAccount?.email}
                </Text>
                <Button
                  variant="ghost"
                  color="var(--gd-accent)"
                  onClick={() => {
                    setMode('login')
                    setLoginForm({
                      email: selectedDemo,
                      password: 'password123',
                    })
                  }}
                >
                  <HStack gap="2">
                    <FiCheckCircle />
                    <Text>Use this account</Text>
                  </HStack>
                </Button>
              </HStack>
            </Stack>
          </Box>
        </Flex>

        <Flex
          align="center"
          justify="center"
          px={{ base: '6', md: '10', xl: '14' }}
          py={{ base: '10', md: '14' }}
        >
          <Box
            rounded="36px"
            border="1px solid rgba(148, 163, 184, 0.16)"
            bg="rgba(255, 255, 255, 0.92)"
            boxShadow="0 32px 64px rgba(15, 23, 42, 0.12)"
            p={{ base: '6', md: '8' }}
            w="full"
            maxW="640px"
          >
            <Stack gap="6">
              <HStack
                rounded="full"
                bg="rgba(226, 232, 240, 0.62)"
                p="1"
                gap="1"
                alignSelf="flex-start"
              >
                <ModeButton
                  active={mode === 'login'}
                  onClick={() => setMode('login')}
                  label="Sign in"
                />
                <ModeButton
                  active={mode === 'register'}
                  onClick={() => setMode('register')}
                  label="Create account"
                />
              </HStack>

              <Stack gap="2">
                <Text
                  fontSize="sm"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.12em"
                  color="var(--gd-accent)"
                >
                  {mode === 'login' ? 'Sign in' : 'Register'}
                </Text>
                <Heading fontSize={{ base: '2xl', md: '3xl' }} color="var(--gd-text)">
                  {mode === 'login' ? 'Continue to your workspace' : 'Create your GoodDocs account'}
                </Heading>
                <Text color="var(--gd-muted)">
                  {mode === 'login'
                    ? 'Use a seeded account or sign in with your own registered user.'
                    : 'Create a new reviewer account and get immediate access to the editor.'}
                </Text>
              </Stack>

              {mode === 'login' ? (
                <Box as="form" onSubmit={handleLoginSubmit}>
                  <Stack gap="5">
                    <Field.Root required>
                      <Field.Label fontWeight="600">Email</Field.Label>
                      <Input
                        type="email"
                        value={loginForm.email}
                        onChange={(event) =>
                          setLoginForm((current) => ({ ...current, email: event.target.value }))
                        }
                        placeholder="ava@gooddocs.test"
                        size="lg"
                        rounded="20px"
                        borderColor="rgba(148, 163, 184, 0.24)"
                        bg="rgba(248, 250, 252, 0.92)"
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label fontWeight="600">Password</Field.Label>
                      <Input
                        type="password"
                        value={loginForm.password}
                        onChange={(event) =>
                          setLoginForm((current) => ({ ...current, password: event.target.value }))
                        }
                        placeholder="password123"
                        size="lg"
                        rounded="20px"
                        borderColor="rgba(148, 163, 184, 0.24)"
                        bg="rgba(248, 250, 252, 0.92)"
                      />
                    </Field.Root>

                    <Button
                      type="submit"
                      loading={status === 'loading'}
                      rounded="full"
                      bg="var(--gd-accent)"
                      color="white"
                      size="lg"
                      _hover={{ opacity: 0.92 }}
                    >
                      <HStack gap="2">
                        <Text>Enter GoodDocs</Text>
                        <FiArrowRight />
                      </HStack>
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box as="form" onSubmit={handleRegisterSubmit}>
                  <Stack gap="5">
                    <Field.Root required>
                      <Field.Label fontWeight="600">Full name</Field.Label>
                      <Input
                        value={registerForm.name}
                        onChange={(event) =>
                          setRegisterForm((current) => ({ ...current, name: event.target.value }))
                        }
                        placeholder="Your name"
                        size="lg"
                        rounded="20px"
                        borderColor="rgba(148, 163, 184, 0.24)"
                        bg="rgba(248, 250, 252, 0.92)"
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label fontWeight="600">Email</Field.Label>
                      <Input
                        type="email"
                        value={registerForm.email}
                        onChange={(event) =>
                          setRegisterForm((current) => ({ ...current, email: event.target.value }))
                        }
                        placeholder="writer@gooddocs.test"
                        size="lg"
                        rounded="20px"
                        borderColor="rgba(148, 163, 184, 0.24)"
                        bg="rgba(248, 250, 252, 0.92)"
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label fontWeight="600">Password</Field.Label>
                      <Input
                        type="password"
                        value={registerForm.password}
                        onChange={(event) =>
                          setRegisterForm((current) => ({ ...current, password: event.target.value }))
                        }
                        placeholder="Minimum 8 characters"
                        size="lg"
                        rounded="20px"
                        borderColor="rgba(148, 163, 184, 0.24)"
                        bg="rgba(248, 250, 252, 0.92)"
                      />
                    </Field.Root>

                    <Field.Root required>
                      <Field.Label fontWeight="600">Confirm password</Field.Label>
                      <Input
                        type="password"
                        value={registerForm.password_confirmation}
                        onChange={(event) =>
                          setRegisterForm((current) => ({
                            ...current,
                            password_confirmation: event.target.value,
                          }))
                        }
                        placeholder="Repeat your password"
                        size="lg"
                        rounded="20px"
                        borderColor="rgba(148, 163, 184, 0.24)"
                        bg="rgba(248, 250, 252, 0.92)"
                      />
                    </Field.Root>

                    <Button
                      type="submit"
                      loading={status === 'loading'}
                      rounded="full"
                      bg="var(--gd-accent)"
                      color="white"
                      size="lg"
                      _hover={{ opacity: 0.92 }}
                    >
                      <HStack gap="2">
                        <Text>Create account</Text>
                        <FiArrowRight />
                      </HStack>
                    </Button>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>
        </Flex>
      </Grid>
    </Box>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Box
      rounded="28px"
      border="1px solid rgba(148, 163, 184, 0.18)"
      bg="rgba(255, 255, 255, 0.76)"
      p="5"
      boxShadow="0 18px 36px rgba(15, 23, 42, 0.06)"
    >
      <Stack gap="3">
        <Box
          rounded="2xl"
          bg="rgba(37, 99, 235, 0.10)"
          color="var(--gd-accent)"
          p="3"
          w="fit-content"
        >
          {icon}
        </Box>
        <Text fontWeight="800" color="var(--gd-text)">
          {title}
        </Text>
        <Text fontSize="sm" color="var(--gd-muted)">
          {description}
        </Text>
      </Stack>
    </Box>
  )
}

function ModeButton({ active, onClick, label }) {
  return (
    <Button
      variant="ghost"
      rounded="full"
      px="5"
      bg={active ? 'white' : 'transparent'}
      color={active ? 'var(--gd-text)' : 'var(--gd-muted)'}
      boxShadow={active ? '0 8px 20px rgba(15, 23, 42, 0.08)' : 'none'}
      onClick={onClick}
      _hover={{ bg: active ? 'white' : 'rgba(255, 255, 255, 0.55)' }}
    >
      {label}
    </Button>
  )
}

export default LoginPage
