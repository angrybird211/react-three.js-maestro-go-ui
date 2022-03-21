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
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

const MonoMicApplications = props => {
    const fgRef = useRef();
    const [highlightNode, setHighlightNode] = useState(null);
    const [highlightLinks, setHighlightLinks] = useState([]);
    const [data, setData] = useState({ links: [], nodes: [] });
    const [isOpenModal, setOpenModal] = useState(false);
    const [app, setApp] = useState(null);
    const [tabID, setTabID] = useState(1);
    const icons = ["fas fa-browser fa-fw", "fas fa-gear fa-fw", "fas fa-microchip fa-fw", "fas fa-microchip fa-fw", "fas fa-microchip fa-fw"];

    const NODE_R = 12;

    useEffect(() => {
        document.querySelector('footer').classList.add('footer-mono-app');

        axios.get("https://maestro2go.azurewebsites.net/api/mono_2_micro", {
            headers: { "Access-Control-Allow-Origin": "*", },
        })
            .then((res) => {
                setData({ links: res.data[0].links, nodes: res.data[0].nodes });
            });

        return (() => {
            if (document.querySelector('footer')) if (document.querySelector('footer')) document.querySelector('footer').classList.remove('footer-mono-app');
        })
    }, []);

    useEffect(() => {
        setTabID(props.match.params.id);
    }, [props.match.params.id]);

    const toggleModal = () => {
        setOpenModal(!isOpenModal);
    }

    const handleNodeClick = node => {
        d3.selectAll("#node-info-container").remove();
        const distance = 400;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        fgRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node,
            3000
        );

        setHighlightLinks([node.resources.links]);
        setHighlightNode(node);
        console.log("node is", node);
        setApp({ id: node.appID, name: node.appName });
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
                            {
                                highlightNode === null ?
                                    <>
                                        <Link className="link" to="/MonoMic">
                                            <span>
                                                <i className="fa-thin fa-album-collection" style={{ fontWeight: 600 }}></i>

                                                Monolithic Applications
                                            </span>
                                        </Link>

                                        <Link className={`link ${tabID === '1' ? 'active' : ''}`} to="/MonoMic/applications/1">
                                            <span>
                                                <i className="fas fa-browser fa-fw"></i>

                                                Application Microservices
                                            </span>
                                        </Link>

                                        <Link className={`link ${tabID === '2' ? 'active' : ''}`} to="/MonoMic/applications/2">
                                            <span>
                                                <i className="fas fa-gear fa-fw"></i>

                                                Services
                                            </span>
                                        </Link>

                                        <Link className={`link ${tabID === '3' ? 'active' : ''}`} to="/MonoMic/applications/3">
                                            <span>
                                                <i className="fas fa-server fa-fw"></i>

                                                Host
                                            </span>
                                        </Link>

                                        <Link className={`link ${tabID === '4' ? 'active' : ''}`} to="/MonoMic/applications/4">
                                            <span>
                                                <i className="fas fa-database fa-fw"></i>

                                                Database
                                            </span>
                                        </Link>
                                    </>
                                    :
                                    <>
                                        <Link className="link" to="/MonoMic">
                                            <span>
                                                <i className="fa-thin fa-album-collection" style={{ fontWeight: 600 }}></i>

                                                Monolithic Applications
                                            </span>
                                        </Link>

                                        <div className="app-name"><span>{app ? app.name : "App Name"}</span></div>

                                        <Link className={`link ${tabID === '1' ? 'active' : ''}`} to={`/MonoMic/application/1`}>
                                            <span>
                                                <i className="fas fa-browser fa-fw"></i>

                                                Application Microservices
                                            </span>
                                        </Link>

                                        <Link className={`link ${tabID === '2' ? 'active' : ''}`} to={`/MonoMic/service/1`}>
                                            <span>
                                                <i className="fas fa-gear fa-fw"><span>{app ? app.services : 0}</span></i>

                                                Services
                                            </span>
                                        </Link>

                                        <Link className={`link ${tabID === '3' ? 'active' : ''}`} to={`/MonoMic/host/1`}>
                                            <span>
                                                <i className="fas fa-server fa-fw"><span>{app ? app.hosts : 0}</span></i>

                                                Host
                                            </span>
                                        </Link>

                                        <Link className={`link ${tabID === '4' ? 'active' : ''}`} to={`/MonoMic/dataset/1`}>
                                            <span>
                                                <i className="fas fa-database fa-fw"><span>{app ? app.datasets : 0}</span></i>

                                                Database
                                            </span>
                                        </Link>
                                    </>
                            }

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
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>CloudRedi’s Mono to Micro feature enables data-driven decision-making for organizations considering microservices. Mono to Micro makes the application environment transparent—quantified and visualized in 3D for you to explore. You can see which apps are best suited to realize the many benefits of microservices, including improved scalability, resilience, flexibility, data security, and organizational agility. This feature also shows you how to structure microservices based on the services, hosts, and databases within the legacy app.</p>
                            </div>
                        </Modal>

                        <ForceGraph3D
                            nodeRelSize={NODE_R}
                            ref={fgRef}
                            graphData={data}
                            nodeOpacity={1}
                            // nodeLabel="id"
                            extraRenderers={[new CSS3DRenderer()]}
                            autoPauseRedraw={false}
                            // nodeAutoColorBy="group"
                            nodeThreeObject={node => {
                                const nodeEl = document.createElement('i');
                                nodeEl.className = icons[node.group];
                                nodeEl.style.color = "#ccc";
                                nodeEl.style.fontSize = "13px";
                                return new CSS3DObject(nodeEl);
                            }}

                            nodeThreeObjectExtend={true}

                            linkOpacity={.8}
                            linkDirectionalParticles={4}
                            linkDirectionalParticleWidth={node => highlightNode === node ? 4 : 2}
                            linkWidth={link => highlightLinks.includes(link) ? 2 : 1}
                            linkColor={link => highlightLinks.indexOf(item => item === link.target || item === link.source) > -1 ? "#456cc8" : link.color}
                            onNodeClick={handleNodeClick}
                            nodeCanvasObjectMode={node => highlightNode === node ? 'before' : undefined}
                            nodeColor={node => highlightNode === node ? "#c3e6e7" : "#0a525d"}
                        />
                    </div>
                </div>
            </div>
        </ React.Fragment >
    );
}

MonoMicApplications.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        })
    })
}

export default MonoMicApplications;