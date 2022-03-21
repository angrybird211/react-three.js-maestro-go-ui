// react libraries
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MetaTags from 'react-meta-tags';
import { Card, CardBody, Col, Row, Container, Modal, BreadcrumbItem } from "reactstrap";
import paginationFactory, { PaginationListStandalone, PaginationProvider } from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import axios from "axios"

// icon
import SortBox from "../../components/Common/SortBox";
import searchIcon from "../../assets/images/intelooSearch.svg";

const monoMic = props => {
  const [appData, setAppData] = useState([]);
  const [isOpenModal, setOpenModal] = useState(false);
  let nameFilter;

  const columnFormatter = (cell, row) => {
    return <Link to={`/MonoMic/application/${row.appID}`}>{cell}</Link>;
  };

  const scoreFormatter = (cell, row) => {
    return <Link to={`/MonoMic/application/${row.appID}`}>{cell}%</Link>;
  }

  const toggleModal = () => {
    setOpenModal(!isOpenModal);
    removeBodyCss();
  }

  const removeBodyCss = () => {
    document.body.classList.add("no_padding");
  }

  const sortFormatter = (column) => {
    return <>
      <div className="column-text">{column.text}</div>

      <div className="sort-wrapper">
        <SortBox title={column.title} ></SortBox>
      </div>
    </>
  }

  const appNameFormatter = (column) => {
    return <>
      <div className="column-text">{column.text}</div>

      <div className="sort-wrapper">
        <input type="text" placeholder="Sort App Name" />
      </div>
    </>
  }

  const columns = [{
    dataField: 'id',
    text: 'Id',
    formatter: columnFormatter
  }, {
    dataField: 'complexScore',
    title: "Sort Complexity Score",
    text: 'ComplexScore(%)',
    sort: true,
    formatter: scoreFormatter,
    headerFormatter: sortFormatter
  }, {
    dataField: 'name',
    title: "Sort App Name",
    text: 'Appname',
    formatter: columnFormatter,
    headerFormatter: appNameFormatter
  }, {
    dataField: 'hostID',
    title: "Sort Host",
    text: 'Host',
    formatter: columnFormatter,
    headerFormatter: sortFormatter
  }, {
    dataField: 'size',
    title: "Sort Size",
    text: 'Size',
    formatter: columnFormatter,
    headerFormatter: sortFormatter
  }, {
    dataField: 'services',
    title: "Sort Services",
    text: 'Services',
    formatter: columnFormatter,
    headerFormatter: sortFormatter
  }, {
    dataField: 'dataSets',
    title: "Sort Data Sets",
    text: 'DataSets',
    formatter: columnFormatter,
    headerFormatter: sortFormatter
  }, {
    dataField: 'dependent',
    title: "Sort By Dependents",
    text: 'Dependent',
    formatter: columnFormatter,
    headerFormatter: sortFormatter
  }];

  const defaultSorted = [{
    dataField: 'id',
    order: 'asc'
  }];

  const pageOptions = {
    sizePerPage: 10,
    totalSize: appData.length, // replace later with size(customers),
    custom: true,
  }

  useEffect(() => {
    axios
      .get("https://maestro2go.azurewebsites.net/api/mono_2_micro", {
        headers: { "Access-Control-Allow-Origin": "*", },
      })
      .then((res) => {
        let appItems = [];
        res.data[0].application.forEach((item, index) => {
          appItems = [...appItems, { ...item, id: index + 1 }];
        })
        setAppData(appItems);
      });
  }, []);

  return (
    <div className="main-content mono-mic">
      <div className="page-content w-100">
        <MetaTags>
          <title>MONO TO MICRO</title>
        </MetaTags>
        <Container fluid>
          <Row>
            <Col xs="12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-0 font-size-18">Mono to Micro</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0 align-items-center">
                    <BreadcrumbItem>
                      <Link to="#">Maestro</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                      <Link to="#">Mono to Micro</Link>
                    </BreadcrumbItem>
                    <li className="modelInfo font-size-18 mt-0 ms-2 pt-0" onClick={() => { setOpenModal(true) }}>
                      <Link to="#" className='mdi mdi-information-outline'></Link>
                    </li>
                  </ol>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        <div className="d-flex">
          <div className="intelBar">

            <Link className="link active" to="/MonoMic">
              <span>
                <i className="fa-thin fa-album-collection" style={{ fontWeight: 600 }}></i>

                Monolithic Applications
              </span>
            </Link>

            <Link className="link" to="/MonoMic/applications/1">
              <span>
                <i className="fas fa-browser fa-fw"></i>

                Application Microservices
              </span>
            </Link>

            <Link className="link" to="/MonoMic/applications/2">
              <span>
                <i className="fas fa-gear fa-fw"></i>

                Services
              </span>
            </Link>

            <Link className="link" to="/MonoMic/applications/3">
              <span>
                <i className="fas fa-server fa-fw"></i>

                Host
              </span>
            </Link>

            <Link className="link" to="/MonoMic/applications/4">
              <span>
                <i className="fas fa-database fa-fw"></i>

                Database
              </span>
            </Link>
          </div>

          <div className="data-source">
            <Row>
              <Col className="col-12">
                <Card>
                  <CardBody>
                    <div className="source-title mb-3">
                      <div className="title-left">
                        <h3>Monolithic Application</h3>
                        <h4>Listing of monolithic applications within your current environment.</h4>
                      </div>
                    </div>

                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField='id'
                      columns={columns}
                      data={appData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField='id'
                          columns={columns}
                          data={appData}
                          search
                        >
                          {toolkitProps => (
                            <React.Fragment>
                              <Row>
                                <Col md="4">
                                  <div className="search-box me-2 mb-2 d-inline-block position-relative">
                                    <Search.SearchBar
                                      {...toolkitProps.searchProps}
                                    />
                                    <img src={searchIcon} className="search-icon" alt="search-icon" width="10" />
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      keyField={"id"}
                                      filter={filterFactory()}
                                      noDataIndication="There is no application"
                                      responsive
                                      bordered={false}
                                      striped={false}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-nowrap"
                                      }
                                      headerWrapperClasses={"thead-light"}
                                      {...toolkitProps.baseProps}
                                      {...paginationTableProps}
                                    />

                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="inner-custom-pagination d-flex">
                                  <div className="text-md-right ms-auto">
                                    <PaginationListStandalone
                                      {...paginationProps}
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </React.Fragment>
                          )
                          }
                        </ToolkitProvider>
                      )
                      }</PaginationProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>

          <Modal
            size="sm"
            isOpen={isOpenModal}
            toggle={toggleModal}
            className="node-info"
          >
            <div className="modal-header">
              <h5
                className="modal-title mt-0"
                id="graphModelInfo"
              >
                AutoGraph - LiveGraph
              </h5>
              <button
                onClick={() => {
                  setOpenModal(false);
                }}
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
              </button>
            </div>
            <div className="modal-body">
              <p>CloudRedi’s Mono to Micro feature enables data-driven decision-making for organizations considering microservices. Mono to Micro makes the application environment transparent—quantified and visualized in 3D for you to explore. You can see which apps are best suited to realize the many benefits of microservices, including improved scalability, resilience, flexibility, data security, and organizational agility. This feature also shows you how to structure microservices based on the services, hosts, and databases within the legacy app.</p>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default monoMic;