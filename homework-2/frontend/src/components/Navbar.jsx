import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    useToast,
    VStack,
  } from "@chakra-ui/react";
  import { useEffect, useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { loginUser } from "../modules/fetch";
  
  const Navbar = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLogin, setIsLogin] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = window.localStorage.getItem("token");
      if (token) {
        setIsLogin(true);
      }
    }, [window.localStorage.getItem("token")]);
  
    return (
      <Flex
        w="full"
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1rem"
        bg="green.500"
        color="yellow.300"
      >
        <Link to="/">
          <Flex align="center" mr={5} cursor="pointer">
            <Text fontSize="xl" fontWeight="bold">
              Bookshelf.Co
            </Text>
          </Flex>
        </Link>
        <HStack>
          {isLogin && (
            <Link to="/newbook">
              <Button colorScheme="blackAlpha">Create New Book</Button>
            </Link>
          )}
          {!isLogin ? (
            <Button onClick={onOpen} colorScheme="yellow" color="green.500">
              Sign In
            </Button>
          ) : (
            <Button
              colorScheme="yellow"
              color="green"
              onClick={() => {
                window.localStorage.removeItem("token");
                setIsLogin(false);
                navigate("/")
              }}
            >
              Logout
            </Button>
          )}
        </HStack>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <form
            id="login-form"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const token = await loginUser(
                  e.target.email.value,
                  e.target.password.value
                );
                window.localStorage.setItem("token", token.token);
                navigate("/");
                toast({
                  title: "Hurray!!",
                  description: "You have successfully logged in.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                onClose();
              } catch (err) {
                toast({
                  title: "Error",
                  description: err.message,
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Login</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button type="submit" form="login-form" colorScheme="green" mr={3}>
                  Login
                </Button>
                <Link to="/register" onClick={onClose}>
                  <Button variant="ghost">
                    Sign Up
                  </Button>
                </Link>
              </ModalFooter>
            </ModalContent>
          </form>
        </Modal>
      </Flex>
    );
  };
  
  export default Navbar;