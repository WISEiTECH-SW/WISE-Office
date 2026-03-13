package kr.co.wise.office.external.hoilday.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ItemsDeserializer extends JsonDeserializer<Items> {

    @Override
    public Items deserialize(JsonParser parser, DeserializationContext context) throws IOException {
        ObjectCodec codec = parser.getCodec();
        JsonNode root = codec.readTree(parser);

        if (root == null || root.isNull() || isBlankText(root)) {
            return new Items(List.of());
        }

        JsonNode itemNode = root.get("item");
        if (itemNode == null || itemNode.isNull() || isBlankText(itemNode)) {
            return new Items(List.of());
        }

        if (itemNode.isArray()) {
            List<HolidayItem> items = new ArrayList<>();
            for (JsonNode node : itemNode) {
                items.add(codec.treeToValue(node, HolidayItem.class));
            }
            return new Items(items);
        }

        if (itemNode.isObject()) {
            return new Items(List.of(codec.treeToValue(itemNode, HolidayItem.class)));
        }

        return new Items(List.of());
    }

    private boolean isBlankText(JsonNode node) {
        return node.isTextual() && node.asText().isBlank();
    }
}
