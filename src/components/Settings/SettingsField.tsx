import { FC } from 'react';

interface Props {
  value: any;
  label: string;
  name: string;
  type: string;
  onChange: (value: any) => void;
}

const SettingsField: FC<Props> = ({ label, onChange, ...props }) => {
  const value = String(props.value);
  const handleChange = (e: any) => {
    const { target } = e;
    if (props.type === 'checkbox') {
      onChange(target.checked);
    } else if (props.type === 'text') {
      onChange(target.value);
    }
  };
  return (
    <>
      <label htmlFor={props.name}>{label}</label>
      <input
        {...props}
        value={value}
        checked={props.value || true}
        onChange={handleChange}
      />
    </>
  );
};

export default SettingsField;
