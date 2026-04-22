import AuthForm from '../components/AuthForm'

function SignupPage({ setActivePage }) {
  return (
    <AuthForm
      type="signup"
      onSwitch={() => setActivePage('login')}
      setActivePage={setActivePage}
    />
  )
}

export default SignupPage