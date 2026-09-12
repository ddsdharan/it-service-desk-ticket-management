import Sidebar from "./Sidebar";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({
  isOpen,
  onClose,
}: MobileSidebarProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
      />

      <div className="relative h-full w-[84vw] max-w-xs shadow-2xl shadow-slate-950/30">
        <Sidebar mobile onClose={onClose} />
      </div>
    </div>
  );
}