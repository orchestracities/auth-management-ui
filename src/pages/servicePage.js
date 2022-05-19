import * as React from "react";
import { MainTitle } from "../components/shared/mainTitle";
import AddButton from "../components/shared/addButton";
import { Grid } from "@mui/material";
import SortButton from "../components/shared/sortButton";
import DashboardCard from "../components/shared/cards";
import ServiceForm from "../components/service/serviceForm";
import axios from "axios";
import Grow from "@mui/material/Grow";
import { Trans } from "react-i18next";

export default function ServicePage({ getTenants, tenantValues, thisTenant }) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [services, setServices] = React.useState([{ children: [] }]);
  const getServices = () => {
    axios
      .get(
        process.env.REACT_APP_ANUBIS_API_URL +
          "v1/tenants/" +
          thisTenant +
          "/service_paths"
      )
      .then((response) => {
        setServices(response.data);
        getTenants();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  React.useEffect(() => {
    getServices();
  }, [thisTenant]);
  const mainTitle = <Trans>service.titles.page</Trans>;

  return (
    <div>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      {typeof thisTenant === undefined || thisTenant === "" ? (
        ""
      ) : (
        <AddButton
          pageType={
            <ServiceForm
              title={<Trans>service.titles.new</Trans>}
              close={setCreateOpen}
              action={"create"}
              getServices={getServices}
              tenantName_id={tenantValues.filter((e) => e.id === thisTenant)}
            />
          }
          setOpen={setCreateOpen}
          status={createOpen}
        ></AddButton>
      )}
      <Grid container spacing={2} sx={{ marginLeft: "15px " }}>
        <Grid item xs={12}>
          {services[0].children.length > 0 ? (
            <SortButton
              data={services[0].children}
              id={"path"}
              sortData={setServices}
            ></SortButton>
          ) : (
            ""
          )}
        </Grid>
        {services[0].children.map((service, index) => (
          <Grow
            in={true}
            style={{ transformOrigin: "0 0 0" }}
            {...(true ? { timeout: index * 600 } : {})}
          >
            <Grid item xs={4}>
              <DashboardCard
                key={service.id}
                pageType={
                  <ServiceForm
                    title={<Trans>service.titles.edit</Trans>}
                    action={"Sub-service-creation"}
                    service={service}
                    getServices={getServices}
                    tenantName_id={tenantValues.filter(
                      (e) => e.id === thisTenant
                    )}
                  />
                }
                data={service}
                getData={getServices}
              ></DashboardCard>
            </Grid>
          </Grow>
        ))}
      </Grid>
    </div>
  );
}
