type Props = {
  children: React.ReactNode;
};
export default function AdminLayout({ children }: Props) {
  return <div className="flex flex-col">{children}</div>;
}
