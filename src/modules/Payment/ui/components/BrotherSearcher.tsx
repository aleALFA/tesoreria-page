import { useCallback, useMemo, useRef, useState } from "react";
import { Select, SelectProps } from "antd";
import { useQuery } from "react-query";

import { usePaymentRepo } from "../../../common/application/context/repositories";
import PaymentRepo from "../../infrastructure/repository/payment.repo";
import { SearchBrotherPaymentProfile } from "../../domain/interfaces";

export type BrotherSearcherProps<T> = SelectProps<T> & {
  optionsMapper?: (list?: SearchBrotherPaymentProfile[]) => SelectProps<object>['options'],
  onSelect?: (brother: SearchBrotherPaymentProfile) => void;
  valueProp?: keyof SearchBrotherPaymentProfile;
  searchTimeout?: number,
  repo?: PaymentRepo,
}

export default function BrotherSearcher<T = SearchBrotherPaymentProfile>(props: BrotherSearcherProps<T>) {
  const mapFunction = useMemo(() => props.optionsMapper ?? mapBroOptions, [props.optionsMapper, mapBroOptions]);
  const repo = useMemo(() => props.repo ?? usePaymentRepo(), [props.repo, usePaymentRepo]);
  const timeout = useMemo(() => props.searchTimeout ?? 500, [props.searchTimeout]);

  const timeoutToSearch = useRef(setTimeout(() => {}));

  const [isSearchingBro, setIsSearchingBro] = useState(false);
  const [search, setSearch] = useState('');

  const broQuery = useQuery(['searchPaymentBrother', search], async (context) => {
    return await repo.searchBrotherProfile(search, context.signal);
  });
  const handleSearch = useCallback((search: string) => {
    setIsSearchingBro(true);
    clearTimeout(timeoutToSearch.current);
    timeoutToSearch.current = setTimeout(async () => {
      setSearch(() => search);
      await broQuery.refetch();
      setIsSearchingBro(false);
    }, timeout);
  }, [broQuery, setSearch, setIsSearchingBro, timeout, timeoutToSearch]);

  const selectProps = useMemo(() => {
    const responseList: any[] | undefined = props.options ?? broQuery.data?.list;
    const keyProp = props.valueProp ?? 'id';

    return {
      ...props,
      placeholder: props.placeholder ?? texts.placeholder,
      options: props.options ?? mapFunction(broQuery.data?.list),
      defaultActiveFirstOption: props.defaultActiveFirstOption ?? false,
      loading: props.loading ?? isSearchingBro,
      onSearch: props.onSearch ?? handleSearch,
      filterOption: props.filterOption ?? false,
      showSearch: props.showSearch ?? true,
      onSelect: (keyValue: string) => {
        if (props.onSelect === undefined) {
          return;
        }

        const brother = responseList?.find(({ brother }) => brother[keyProp] === keyValue);
        props.onSelect(brother);
      },
    } as SelectProps;
  }, [props, handleSearch, mapFunction, isSearchingBro, broQuery.data?.list]);

  return <Select {...selectProps} />;
}

const texts = {
  placeholder: 'Buscar por nombre',
};

export const mapBroOptions = (list?: SearchBrotherPaymentProfile[]): SelectProps<object>['options'] => {
  if (list === undefined) return [];
  return list.map(({ brother }) => ({
    label: brother.name,
    value: brother.id,
  }));
}
