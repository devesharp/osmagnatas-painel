import {
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  QuoteIcon,
  TextIcon,
} from "lucide-react"

export const blockTypeToBlockName: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  paragraph: {
    label: "Normal",
    icon: <TextIcon className="size-4" />,
  },
  h1: {
    label: "H1",
    icon: <Heading1Icon className="size-4" />,
  },
  h2: {
    label: "H2",
    icon: <Heading2Icon className="size-4" />,
  },
  h3: {
    label: "H3",
    icon: <Heading3Icon className="size-4" />,
  },
  number: {
    label: "Lista numerada",
    icon: <ListOrderedIcon className="size-4" />,
  },
  bullet: {
    label: "Lista Padrão",
    icon: <ListIcon className="size-4" />,
  },
  check: {
    label: "Check List",
    icon: <ListTodoIcon className="size-4" />,
  },
  code: {
    label: "Code Block",
    icon: <CodeIcon className="size-4" />,
  },
  quote: {
    label: "Citação",
    icon: <QuoteIcon className="size-4" />,
  },
}
