import { Input } from "antd";

interface tableHeaderProps {
  loading: boolean;
  onSearch: (search: string) => Promise<void>;
  title: string;
  placeholder?: string;
}
export default function TableHeader(props: tableHeaderProps) {
  return (
    <div className="flex justify-between items-center items-center">
      <h2 className="m-0">{props.title}</h2>
      <div className="max-w-max">
        <Input.Search
          enterButton
          allowClear
          loading={props.loading}
          onSearch={(value) => props.onSearch(value)}
          placeholder={props.placeholder}
          onPressEnter={(event) => props.onSearch(event.currentTarget.value)}
        />
      </div>
    </div>
  );
}