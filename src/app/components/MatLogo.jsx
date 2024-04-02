import useSettings from "app/hooks/useSettings";

export default function MatLogo({ className }) {
  const { settings } = useSettings();
  const theme = settings.themes[settings.activeTheme];

  return (
    <img
      src="/assets/images/LogoIcon.png"
      alt="logo"
      className={className}
      width="24px"
      height="24px"
    />
  );
}
