import Sandbox from "./sandbox"

export const metadata = {
  title: 'Virtual Kiosk | Structured Output Demo',
  description: 'A Demonstration of Structured Output',
  icons: {
    icon: '/next.svg',
    shortcut: '/vercel.svg',
  }
}

export const viewport = {
  viewport: 'minimum-scale=1.0, initial-scale=1.0, width=device-width, user-scalable=0',
}

export default function Page() {
  return <Sandbox />
}