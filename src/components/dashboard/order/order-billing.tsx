import { useState } from "react";
import type { ChangeEvent, FC } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  TextField,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { PropertyList } from "../../property-list";
import { PropertyListItem } from "../../property-list-item";

import { Billing } from "@interfaces/order";

import { getMonthDay } from "@lib/date";

interface OrderBillingProps {
  billing: Billing;
}

const statusOptions = ["Canceled", "Complete", "Pending", "Rejected"];

export const OrderBilling: FC<OrderBillingProps> = (props) => {
  const { billing, ...other } = props;
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [status, setStatus] = useState<string>(statusOptions[0]);
  const { t } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const align = smDown ? "vertical" : "horizontal";

  return (
    <Card {...other}>
      <CardHeader title={t("Billing Address")} />
      <Divider />
      <PropertyList>
        <PropertyListItem align={align} label="ID" value={billing.id} />
        {billing?.company && (
          <>
            <Divider />
            <PropertyListItem
              align={align}
              label={t("Company")}
              value={billing.company}
            />
          </>
        )}
        {billing?.department && (
          <>
            <Divider />
            <PropertyListItem
              align={align}
              label={t("Department")}
              value={billing.department}
            />
            <Divider />
          </>
        )}
        <Divider />
        <PropertyListItem
          align={align}
          label={t("Salutation")}
          value={billing.salutation}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label={t("Name")}
          value={`${billing.firstName} ${billing.lastName}`}
        />
        <Divider />
        {billing?.phone && (
          <>
            <PropertyListItem
              align={align}
              label={t("Phone")}
              value={billing.phone}
            />
            <Divider />
          </>
        )}
        <PropertyListItem
          align={align}
          label={t("Country")}
          value={billing.country.isoName}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label={t("City")}
          value={billing.city}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label={t("Street")}
          value={billing.street}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label={t("Zipcode")}
          value={billing.zipCode}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label={t("Additional AddressLine1")}
          value={billing.additionalAddressLine1}
        />
      </PropertyList>
    </Card>
  );
};

OrderBilling.propTypes = {
  // @ts-ignore
  billing: PropTypes.object.isRequired,
};
