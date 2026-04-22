import AuthForm from '../components/AuthForm'

function LoginPage({ setActivePage }) {
  return (
    <AuthForm
      type="login"
      onSwitch={() => setActivePage('signup')}
      setActivePage={setActivePage}
    />
  )
}

export default LoginPage