import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { router } from 'expo-router';
import { useSession } from "../context/ctx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { signIn } = useSession();

  useEffect(() => {
    if( !email || !password ) {
      setError("Hay campos requeridos sin completar");
    } else {
      setError("");
    }
  }, [email, password]);

  const handleLogin = async () => {
    if (email && password) {
        try {
          const response = await fetch("http://192.168.1.8:3001/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
          if (response.ok) {
            const data = await response.json();
            console.log(data)
            if (data.token) {
              signIn(JSON.stringify(data));
              router.replace('/');
            } else {
              setError("Usuario o contraseña incorrectos");
            }
          } else {
            setError("Usuario o contraseña incorrectos");
          }
        } catch (error) {
          console.log(error);
          setError("Error de conexión");
        }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Image
          source={require("@/assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#C4C4C4"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#C4C4C4"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={error != ""}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text
          onPress={() => {
            router.replace('/register');
          }}>
          Crea tu cuenta clickeando aqui
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C4C4C4",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    height: 48,
    borderRadius: 8,
    backgroundColor: "#0070F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 8,
  },
});
