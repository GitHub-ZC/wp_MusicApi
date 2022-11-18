'body'   => json_encode(
    array(
    'relate'    => 1,
    'userid'    => '0',
    'vip'       => 0,
    'appid'     => 1000,
    'token'     => '',
    'behavior'  => 'download',
    'area_code' => '1',
    'clientver' => '8990',
    'resource'  => array(array(
        'id'   => 0,
        'type' => 'audio',
        'hash' => $id,
    )), )
),


JSON.stringify([
    relate
])