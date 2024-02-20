import relativeDate from '../libs/relativeDate';
export default function(props) {
    //console.log(props.program);
    return (<main className="Main">
        <div className="title-and-code-button">
            <h1>Viewing Program</h1>
            <a href="#" className="button code-button">View Code in Editor</a>
        </div>
        <div className="surface program-info-surface" style={{
            position: 'relative'
        }}>
            <h2>Program Data</h2>
            <div className="program-info-thumbnail-wrapper">
                <img style={{
                        borderRadius: ".5rem",
                        width: "100%",
                        width: '200px',
                        height: "auto"
                    }} 
                    src={props.program.thumbnail} 
                    alt='Program thumbnail for "{props.program.title}"'
                />
            </div>
            <table className="table">
                <tr>
                    <th>Title</th>
                    <td>{props.program.title}</td>
                </tr>
                <tr>
                    <th>ID</th>
                    <td>{props.program.id}</td>
                </tr>
                <tr>
                    <th>Created</th>
                    <td title={new Date(props.program.created)}>{relativeDate(props.program.created)}, {props.program.created}</td>
                </tr>
                <tr>
                    <th>Updated</th>
                    <td title={new Date(props.program.updated)}>{relativeDate(props.program.updated)}, {props.program.updated}</td>
                </tr>
                <tr>
                    <th>Code</th>
                    <td style={{ display: 'flex' }}>
                        <textarea id="program-code" style={{ resize: 'vertical', flex: 1, minWidth: 0 }} rows="1" className="input" value={props.program.code} readOnly></textarea>
                        <input id="copy-code-button" className="button" type="button" value="Copy" />
                    </td>
                </tr>
                <tr>
                    <th>Folds</th>
                    <td>{props.program.folds}</td>
                </tr>
                <tr>
                    <th>Fork</th>
                    <td>{props.program.fork.toString()}</td>
                </tr>
                <tr>
                    <th>Key</th>
                    <td>{props.program.key}</td>
                </tr>
                <tr>
                    <th>Votes</th>
                    <td>{props.program.votes}</td>
                </tr>
                <tr>
                    <th>Spin-Offs</th>
                    <td>{props.program.spinoffs}</td>
                </tr>
                <tr>
                    <th>Type</th>
                    <td>{props.program.type}</td>
                </tr>
                <tr>
                    <th>Width</th>
                    <td>{props.program.width}</td>
                </tr>
                <tr>
                    <th>Height</th>
                    <td>{props.program.height}</td>
                </tr>
                <tr>
                    <th>User Flagged</th>
                    <td>{props.program.userFlagged.toString()}</td>
                </tr>
                <tr>
                    <th>Origin Scratchpad</th>
                    <td>{JSON.stringify(props.program.originScratchpad) || 'null'}</td>
                </tr>
                <tr>
                    <th>Hidden From Hotlist</th>
                    <td>{props.program.hiddenFromHotlist.toString()}</td>
                </tr>
                <tr>
                    <th>Restricted Posting</th>
                    <td>{props.program.restrictedPosting.toString()}</td>
                </tr>
                <tr>
                    <th>By Child</th>
                    <td>{props.program.byChild.toString()}</td>
                </tr>
                <tr>
                    <th>Author Nick</th>
                    <td>{props.program.author.nick}</td>
                </tr>
                <tr>
                    <th>Author Name</th>
                    <td>{props.program.author.name}</td>
                </tr>
                <tr>
                    <th>Author ID</th>
                    <td>{props.program.author.id}</td>
                </tr>
                <tr>
                    <th>Author Profile Access</th>
                    <td>{props.program.author.profileAccess}</td>
                </tr>
            </table>
            <br/>
            <h2>Archive Data</h2>
            <table className="table">
                <tr>
                    <th>Added</th>
                    <td title={new Date(props.program.archive.added)}>{relativeDate(props.program.archive.added)}, {props.program.archive.added}</td>
                </tr>
                <tr>
                    <th>Updated</th>
                    <td title={new Date(props.program.archive.updated)}>{relativeDate(props.program.archive.updated)}, {props.program.archive.updated}</td>
                </tr>
            </table>
        </div>
        <script src="/js/view-page.js"></script>
    </main>);
};
