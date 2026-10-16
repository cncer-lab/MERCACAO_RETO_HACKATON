const USERS = [
  {
    username: "operador",
    password: "123456",
    role: "OPERADOR",
    name: "Operador Demo",
  },
  {
    username: "admin",
    password: "123456",
    role: "ADMINISTRADOR",
    name: "Administrador Demo",
  },
];

export function login(username, password) {
  const user = USERS.find(
    (item) =>
      item.username === username &&
      item.password === password
  );

  if (!user) {
    return {
      success: false,
      message: "Usuario o contraseña incorrectos.",
    };
  }

  const session = {
    username: user.username,
    role: user.role,
    name: user.name,
  };

  localStorage.setItem(
    "mercacao_user",
    JSON.stringify(session)
  );

  return {
    success: true,
    user: session,
  };
}

export function getCurrentUser() {
  const user = localStorage.getItem("mercacao_user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
}

export function logout() {
  localStorage.removeItem("mercacao_user");
}