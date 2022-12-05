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

import type { Shipping } from "@interfaces/order";

interface OrderShippingProps {
  shipping: Shipping;
}

const statusOptions = ["Canceled", "Complete", "Pending", "Rejected"];

export const OrderShipping: FC<OrderShippingProps> = (props) => {
  const { shipping, ...other } = props;
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const [status, setStatus] = useState<string>(statusOptions[0]);
  const { t } = useTranslation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStatus(event.target.value);
  };

  const align = smDown ? "vertical" : "horizontal";

  return (
    <Card {...other}>
      <CardHeader title={t("Shipping Address")} />
      <Divider />
      <PropertyList>
        <PropertyListItem align={align} label="ID" value={shipping.id} />
        <Divider />
        {shipping?.company && (
          <>
            <PropertyListItem
              align={align}
              label={t("Company")}
              value={shipping.company}
            />
            <Divider />
          </>
        )}
        {shipping?.department && (
          <>
            <PropertyListItem
              align={align}
              label={t("Department")}
              value={shipping.department}
            />
            <Divider />
          </>
        )}
        <PropertyListItem
          align={align}
          label={t("Salutation")}
          value={shipping.salutation}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label={t("Name")}
          value={`${shipping.firstName} ${shipping.lastName}`}
        />
        <Divider />
        {shipping?.phone && (
          <>
            <PropertyListItem
              align={align}
              label={t("Phone")}
              value={shipping.phone}
            />
            <Divider />
          </>
        )}

        <PropertyListItem
          align={align}
          label={t("Country")}
          value={shipping.country.isoName}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label={t("Invoice Shipping TaxRate")}
          value={shipping.city}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label={t("Invoice Shipping Net")}
          value={shipping.street}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label={t("Zipcode")}
          value={shipping.zipCode}
        />
        <Divider />
        <PropertyListItem
          align={align}
          label={t("Additional AddressLine1")}
          value={shipping.additionalAddressLine1}
        />
        {shipping?.additionalAddressLine2 && (
          <>
            <Divider />
            <PropertyListItem
              align={align}
              label={t("Additional AddressLine2")}
              value={shipping.additionalAddressLine2}
            />
          </>
        )}
      </PropertyList>
    </Card>
  );
};

OrderShipping.propTypes = {
  // @ts-ignore
  shipping: PropTypes.object.isRequired,
};
