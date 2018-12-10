<!-- modal -->
<div id="modalSettings" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title">Settings</h1>
                <button type="button" class="close" data-dismiss="modal" style="position:absolute; right:10px;">&times;</button>
            </div>
            <div class="modal-body">
                <label id="mapStyleButton" for="containerViews">Map style</label>
                <div id="containerViews" class=" containerStyles">
                    <button type="button" class="btn btnStyle" id="style0">Basic</button><button type="button" class="btn btnStyle" id="style1">Streets</button><button type="button" class="btn btnStyle" id="style2">Light</button><button type="button" class="btn btnStyle" id="style3">Dark</button><button type="button" class="btn btnStyle" id="style4">Satellite</button>
                </div>

                <label id="clusterButton" for="containerViews">Display</label>
                <div id="containerClusters">
                    <input type="radio" name="viewClusters" id="viewClusters" checked="checked"><label for="viewClusters"> Clusters</label>
                    <input type="radio" name="viewClusters" id="viewPoints"><label for="viewPoints"> Points</label>
                </div>
            </div>
        </div>
    </div>
</div>