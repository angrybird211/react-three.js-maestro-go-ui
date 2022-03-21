// react libraries
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MetaTags from 'react-meta-tags';
import { Col, Row, Container, Modal, BreadcrumbItem } from "reactstrap";
import ForceGraph3D from 'react-force-graph-3d';
import PropTypes from 'prop-types';
import axios from "axios"

// three.js libraires
import * as d3 from "d3";
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

import appData from '../../common/data/monoMicAppList.json';

const MonoMicApplication = props => {
    const fgRef = useRef();
    const [highlightNode, setHighlightNode] = useState(null);
    const [data, setData] = useState(null);
    const [clusterData, setClusterData] = useState(null);
    const [isOpenModal, setOpenModal] = useState(false);
    const [app, setApp] = useState(null);
    const [activeHost, setActiveHost] = useState(null);
    const [isOpenInfo, setOpenInfo] = useState(false);
    const icons = {
        "app": "fas fa-browser fa-fw",
        "service": "fas fa-gear fa-fw",
        "host": "fas fa-microchip fa-fw",
        "dataset": "fas fa-database fa-fw"
    };

    const NODE_R = 12;

    useEffect(() => {
        document.querySelector('footer').classList.add('footer-mono-app');

        // axios.get("https://maestro2go.azurewebsites.net/api/mono_2_micro", {
        //     headers: { "Access-Control-Allow-Origin": "*", },
        // })
        //     .then((res) => {
        // setData({ links: res.data[0].groups[0].links, nodes: res.data[0].groups[0].nodes });
        // });

        setApp(appData.app[props.match.params.id - 1]);
        let clusterID = appData.app[props.match.params.id - 1].clusterID;
        setData(appData);
        setClusterData(appData.clusters[clusterID - 1]);
        // setData({ links: appData.links, nodes: appData.nodes });

        return (() => {
            if (document.querySelector('footer')) document.querySelector('footer').classList.remove('footer-mono-app');
        })
    }, []);

    const toggleModal = () => {
        setOpenModal(!isOpenModal);
    }

    const toggleInfo = () => {
        setOpenInfo(!isOpenInfo);
    }

    const nodeColor = (node) => {
        if (highlightNode === node) return "#c3e6e7";
        if (node.category === 'host' || node.category === 'app') return "#0a525d";
        return "#091425";
    }

    const handleNodeClick = node => {
        if (node.category === "host") {
            setApp(data.app[node.appID - 1]);
            setActiveHost(data.hosts[node.groupID - 1]);
            // d3.selectAll("#node-info-container").remove();
            // const distance = 400;
            // const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

            // fgRef.current.cameraPosition(
            //     { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            //     node,
            //     3000
            // );

            setHighlightNode(node);
            setOpenInfo(true);
        } else {
            setHighlightNode(null);
        }
    };


    return (
        <React.Fragment>
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
                            <Link className="link" to="/MonoMic">
                                <span>
                                    <i className="fa-thin fa-album-collection" style={{ fontWeight: 600 }}></i>

                                    Monolithic Applications
                                </span>
                            </Link>

                            <div className="app-name"><span>{app ? app.name : "App Name"}</span></div>

                            <Link className="link" to="/MonoMic/application/1">
                                <span>
                                    <i className="fas fa-browser fa-fw"></i>

                                    Application Microservices
                                </span>
                            </Link>

                            <Link className="link" to="/MonoMic/service/1">
                                <span>
                                    <i className="fas fa-gear fa-fw"><span>{app ? app.services : 0}</span></i>

                                    Services
                                </span>
                            </Link>

                            <Link className="link active" to="/MonoMic/host/1">
                                <span>
                                    <i className="fas fa-server fa-fw"><span>{app ? app.hosts : 0}</span></i>

                                    Host
                                </span>
                            </Link>

                            <Link className="link" to="/MonoMic/dataset/1">
                                <span>
                                    <i className="fas fa-database fa-fw"><span>{app ? app.datasets : 0}</span></i>

                                    Database
                                </span>
                            </Link>
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
                                    Application - Cluster
                                </h5>
                                <button
                                    onClick={() => {
                                        setOpenInfo(false);
                                    }}
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>CloudRedi’s Mono to Micro feature enables data-driven decision-making for organizations considering microservices. Mono to Micro makes the application environment transparent—quantified and visualized in 3D for you to explore. You can see which apps are best suited to realize the many benefits of microservices, including improved scalability, resilience, flexibility, data security, and organizational agility. This feature also shows you how to structure microservices based on the services, hosts, and databases within the legacy app.</p>
                            </div>
                        </Modal>

                        <Modal
                            size="sm"
                            isOpen={isOpenInfo}
                            toggle={toggleInfo}
                            className="node-info"
                        >
                            <div className="modal-header">
                                <h5
                                    className="modal-title mt-0"
                                    id="graphModelInfo"
                                >
                                    Application Hosts
                                </h5>
                                <button
                                    onClick={() => {
                                        setOpenInfo(false);
                                    }}
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            {
                                activeHost ?
                                    <div className="modal-body">
                                        <p>App ID: &nbsp;{activeHost.appID}</p>
                                        <p>Host Name: &nbsp;{activeHost.name}</p>
                                        <p>Service ID: &nbsp;{activeHost.serviceID}</p>
                                        <p>Resources: <br />
                                            &nbsp;&nbsp;Limits: &nbsp;&nbsp;CPU: {activeHost.resources.limits.cpu} &nbsp;&nbsp;Memory: {activeHost.resources.limits.memory}<br />
                                            &nbsp;&nbsp;Requests: &nbsp;&nbsp;CPU: {activeHost.resources.requests.cpu} &nbsp;&nbsp;Memory: {activeHost.resources.requests.memory}</p>
                                    </div> : ""
                            }
                        </Modal>

                        {
                            clusterData ?
                                <ForceGraph3D
                                    nodeRelSize={10}
                                    ref={fgRef}
                                    graphData={{ links: clusterData.links, nodes: clusterData.nodes }}
                                    nodeOpacity={1}
                                    // nodeLabel="id"
                                    extraRenderers={[new CSS3DRenderer()]}
                                    autoPauseRedraw={false}
                                    // nodeAutoColorBy="group"
                                    linkStrength={20}
                                    nodeThreeObject={node => {
                                        const nodeEl = document.createElement('i');
                                        nodeEl.className = icons[node.category];
                                        nodeEl.style.color = "#ccc";
                                        nodeEl.style.fontSize = "8px";
                                        return new CSS3DObject(nodeEl);
                                    }}

                                    nodeThreeObjectExtend={true}

                                    linkOpacity={.8}
                                    linkDirectionalParticles={4}
                                    linkDirectionalParticleWidth={node => highlightNode === node ? 4 : 2}
                                    onNodeClick={handleNodeClick}
                                    nodeCanvasObjectMode={node => highlightNode === node ? 'before' : undefined}
                                    nodeColor={nodeColor}
                                /> : ""
                        }
                    </div>
                </div>
            </div>
        </ React.Fragment >
    );
}

MonoMicApplication.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        })
    })
}
export default MonoMicApplication;