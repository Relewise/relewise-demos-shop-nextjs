import { basePath } from "@/util/basePath";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function ConfigureDemoSettingsButton() {
  return (
    <a
      href={`${basePath}/app-settings`}
      className="text-zinc-600 inline-flex items-center whitespace-nowrap py-2 hover:text-black"
    >
      <Cog6ToothIcon className="w-5 h-5 mr-1" /> Configure Demo
    </a>
  );
}
